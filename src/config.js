const dev = {
    apiGateway: {
      REGION: "YOUR_DEV_API_GATEWAY_REGION",
      URL: "YOUR_DEV_API_GATEWAY_URL"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_oLuzVMPIG",
      APP_CLIENT_ID: "5j850mqlm53uceshm4jd5qnsou",
      IDENTITY_POOL_ID: "us-east-1:b494ddb0-5ca0-4915-8252-13d1ab932f37"
    }
  };
  
  const prod = {
    apiGateway: {
      REGION: "YOUR_PROD_API_GATEWAY_REGION",
      URL: "YOUR_PROD_API_GATEWAY_URL"
    },
    cognito: {
      REGION: "YOUR_PROD_COGNITO_REGION",
      USER_POOL_ID: "YOUR_PROD_COGNITO_USER_POOL_ID",
      APP_CLIENT_ID: "YOUR_PROD_COGNITO_APP_CLIENT_ID",
      IDENTITY_POOL_ID: "YOUR_PROD_IDENTITY_POOL_ID"
    }
  };
  
  // Default to dev if not set
  const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;
  
  export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
  };