---
page_type: sample
name: Authenticate and authorize users end-to-end in Azure App Service with JavaScript
description: This tutorial shows how to secure two App Services (frontend and backend), passing user auth from the frontend app to the backend. 
languages:
- javascript
products:
- azure-app-service
---

# Authenticate and authorize users end-to-end in Azure App Service

Azure App Service provides a highly scalable, self-patching web hosting service. In addition, App Service has built-in support for [user authentication and authorization](https://learn.microsoft.com/azure/app-service/overview-authentication-authorization). This tutorial shows how to secure your apps with App Service authentication and authorization. It uses an Express.js with views frontend as an example. App Service authentication and authorization support all language runtimes, and you can learn how to apply it to your preferred language by following the tutorial.

## Features

In the tutorial, you learn:

> [!div class="checklist"]
> * Enable built-in authentication and authorization
> * Secure apps against unauthenticated requests
> * Use Azure Active Directory as the identity provider
> * Access a remote app on behalf of the signed-in user
> * Secure service-to-service calls with token authentication
> * Use access tokens from server code
> * Use access tokens from client (browser) code

## Read the tutorial

[Read the tutorial](https://learn.microsoft.com/azure/app-service/tutorial-auth-aad) to understand how to deploy this scenario to App Service.