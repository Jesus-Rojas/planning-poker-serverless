import AWS from 'aws-sdk';

const ssm = new AWS.SSM();

export const getParameters = async (ssmNames) => {
  const { Parameters: parameters } = await ssm
    .getParameters({
      Names: ssmNames,
      WithDecryption: true
    })
    .promise();

  return parameters;
};

export const getParameterValue = (parameterName, parameters) => (
  parameters.find(({ Name: name }) => (name === parameterName)).Value
);
