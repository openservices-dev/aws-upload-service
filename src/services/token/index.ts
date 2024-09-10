import JWT from './jwt';
import AWSCognitoToken from './AWSCognito';
import config from '../../config';

const container = {
  get JWT() {
    return new JWT(config.services.token.secret);
  },

  get AWSCognito() {
    return new AWSCognitoToken(
      config.services.token.aws.region,
      config.services.token.aws.userPoolId,
      config.services.token.aws.clientId,
    );
  },
};

export default container;
