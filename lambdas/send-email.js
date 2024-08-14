import AWS from 'aws-sdk';

import { ENV } from "../constants/config.js";
import { handleError } from "../shared/handle-error.js";
import { getParameterValue, getParameters } from "../shared/ssm.js";
import { responseDefault } from '../constants/response-default.js';

export const handler = async () => {
  const message = 'Este es el cuerpo del mensaje de correo electrónico.';
  const subject = 'Asunto del correo electrónico';
  const ssmNames = [ENV.ARN_THEME_SNS];
  try {
    const parameters = await getParameters(ssmNames);
    if (parameters.length !== ssmNames.length) return handleError();
    const topicArn = getParameterValue(ENV.ARN_THEME_SNS, parameters);
    const params = {
      Message: message,
      Subject: subject,
      TopicArn: topicArn,
    };
    const sns = new AWS.SNS();
    const data = await sns.publish(params).promise();
    console.log(`Message ${data.MessageId} sent to the topic ${params.TopicArn}`);

    return {
      ...responseDefault,
      body: JSON.stringify({
        message: `Correo enviado con ID: ${data.MessageId}`
      }),
    };
  } catch (err) {
    return handleError(err);
  }
};
