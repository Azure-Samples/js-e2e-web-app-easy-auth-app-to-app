# Prerequisites: jq (available in the Azure Cloud Shell)

# Replace <RESOURCE-GROUP-NAME> with the name of the resource group
# Replace <FRONTEND-RESOURCE-NAME> with the name of the frontend app
# Replace <BACKEND-RESOURCE-NAME> with the name of the backend app

authSettings=$(az webapp auth show -g <RESOURCE-GROUP-NAME> -n <FRONTEND-RESOURCE-NAME>-2)
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid profile email offline_access api://<BACKEND-RESOURCE-NAME>/user_impersonation"]}')
az webapp auth set --resource-group <RESOURCE-GROUP-NAME> --name <FRONTEND-RESOURCE-NAME>-2 --body "$authSettings"