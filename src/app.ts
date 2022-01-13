import express, {Express} from "express";
import {Config} from "./config";
import swaggerUi, {JsonObject} from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { User } from "./models/user.model";
import { Phone, Person } from "./models/phone.model";
import {Runner} from "./lib/runners/runner";
import { PlatformTools } from './lib/platform/PlatformTools';
import { FileUtils } from "./lib/utils/FileUtils";
import { PathString } from "./typings";
import { SwaggifyException } from "./exceptions/SwaggifyException";

/**
 * Implicit Express Server.
 */
class App extends Config {

    private app: Express;

    constructor() {
        super();
    }



    /**
     * Initialize and Setup the server.
     * @param expressApp expressApplication
     * @param swaggerEndpoint  swaggerEndpointUrl
     * @param swaggerConfigFile swaggerConfigFilePath
     */
    public init(expressApp: Express, swaggerConfigFile: string,  swaggerEndpoint: PathString, ): void {
        this.app = expressApp;
        this.run(swaggerConfigFile, swaggerEndpoint);
    }


    /**
     * Serves swagger file in specified file and endpoint
     * @param swaggerEndpoint  swaggerEndpointUrl
     * @param swaggerConfigFile swaggerConfigFilePath
     */
    public serveSwagger(swaggerConfigFile: string, swaggerEndpoint: PathString): void {
        import(swaggerEndpoint).then((file) =>  {
            const specs: JsonObject = swaggerJsdoc(file);
            this.app.use(swaggerConfigFile, swaggerUi.serve, swaggerUi.setup(specs));
        });
    }    


    /**
     * Runs and executes swaggify
     * @param swaggerEndpoint  swaggerEndpointUrl
     * @param swaggerConfigFile swaggerConfigFilePath
     */
    private async run(swaggerConfigFile: string, swaggerEndpoint: PathString) {    
       
        new Phone();
        new Person();
        new User();
        
        Runner.execute();

       setTimeout(() => {
            this.serveSwagger(swaggerConfigFile, swaggerEndpoint);
       }, 2000); 
    }
}

export default App;

