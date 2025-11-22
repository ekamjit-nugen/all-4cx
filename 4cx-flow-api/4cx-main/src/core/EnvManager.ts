export default class EnvManager {
    public static getConfig = (name: string, defaultResult: string = "") => {
        return process.env[name] ?? defaultResult;
    }

    public static getDBConnection = () => {
        return this.getConfig("DB_URI");
    }

    public static getAppPort = () => {
        return this.getConfig("PORT");
    }

    public static getClerkSecretKey = () => {
        return this.getConfig("CLERK_SECRET_KEY");
    }

    public static getClerkWebHookSecretKey = () => {
        return this.getConfig("CLERK_WEBHOOK_SECRET_KEY");
    }

    public static getAzureAccountName = () => {
        return this.getConfig("AZURE_ACCOUNT_NAME");
    }

    public static getAzureAccountKey = () => {
        return this.getConfig("AZURE_ACCOUNT_KEY");
    }

    public static getAzureContainerName = () => {
        return this.getConfig("AZURE_CONTAINER_NAME");
    }
    
    public static getAzureConnectionString = ()=>{
        return this.getConfig("AZURE_CONNECTION_STRING");
    }

    public static getKafkaClientId = ()=>{
        return this.getConfig("KAFKA_CLIENT_ID");
    }

    public static getKafkaBrokers = () => {
        return this.getConfig("KAFKA_BROKERS");
    }
    
    public static getKafkaTopic = () => {
        return this.getConfig("KAFKA_TOPIC");
    }
    
    public static getKafkaGroupId = () =>{
        return this.getConfig("KAFKA_GROUP_ID");
    }

    public static getAuthSecretKey = () => {
        return this.getConfig("AUTH_SECRET_KEY")
    }
}