const AWS = require("aws-sdk");
const crypto = require("crypto");

// Generate unique id
const generateUUID = () => crypto.randomBytes(16).toString("hex");

// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
    const params = {
        TableName: "scores"
    };
    try {
        const data = await documentClient.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify(e)
        };
    }
};
