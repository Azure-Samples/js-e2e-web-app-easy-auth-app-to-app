frontendapp=frontend-diberry-0301-01
backendapp=backend-diberry-0301-01
groupname=app-diberry-1
planname=app-plan
backendurl=https://$backendapp.azurewebsites.net

echo $backendurl

cd js-e2e-web-app-easy-auth-app-to-app/
cd frontend/
az webapp up -n $frontendapp -g $groupname --plan $planname --sku FREE -l westeurope
cd ../backend/
az webapp up -n $backendapp -g $groupname --plan $planname -l westeurope
az webapp config appsettings set --name $frontendapp --resource-group $groupname --settings BACKEND_URL=$backendurl
# Deploy new apps finished

# <configure auth express manually>

frontendId=$(az webapp auth microsoft show --name $frontendapp --resource-group $groupname --query registration.clientId --output tsv)
backendId=$(az webapp auth microsoft show --name $backendapp --resource-group $groupname --query registration.clientId --output tsv)
az ad sp show --id $backendId --query oauth2PermissionScopes

az ad app permission grant --id $frontendId --api $backendId --scope user_impersonation
#authSettings=$(az webapp auth show -g $groupname -n $frontendapp)
#authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid offline_access api://$backendId/user_impersonation"]}')
# az webapp auth set --resource-group $groupname --name $clientappname --body "$authSettings"

# Stage 1 works

# backendId=$(az webapp auth microsoft show --name $apiappname --resource-group $groupname --query registration.clientId --output tsv)
# az ad app permission grant --id $backendId --api 00000003-0000-0000-c000-000000000000 --scope User.Read