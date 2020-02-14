const AWS = require("aws-sdk");
const crypto = require("crypto");

// Generate unique id
const generateUUID = () => crypto.randomBytes(16).toString("hex");

// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
    const {time} = JSON.parse(event.body);
    const params = {
        TableName: "scores",
        Item: {
            id: generateUUID(),
            time: time
        }
    };
    try {
        const data = await documentClient.put(params).promise();
        return {
            statusCode: 200,
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
