import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

const MAX_MESSAGE_LENGTH = 4000;

const formatDescription = (message) => {
  return message.length > MAX_MESSAGE_LENGTH ? message.substring(0, MAX_MESSAGE_LENGTH) + '...' : message;
};

const run = async () => {
  const webhook = core.getInput('webhook');
  const message = core.getInput('message');
  const title = core.getInput('title');
  const iconUrl = core.getInput('icon_url');
  const username = core.getInput('username');
  const color = core.getInput('color');

  const requestBody = {
    embeds: [
      {
        description: formatDescription(message),
        color: color,
        title: title,
      },
    ],
    avatar_url: iconUrl,
    username: username,
  };

  const url = `${webhook}?wait=true`;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => core.info(JSON.stringify(data)))
    .catch((err) => {
      console.error(err);
      core.info(err);
    });
};

run()
  .then(() => {
    core.info('Action completed!');
  })
  .catch((error) => {
    console.error(error);
    core.setFailed(error.message);
  });
