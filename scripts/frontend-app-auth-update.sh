# Prerequisites: jq (available in the Azure Cloud Shell)

frontendapp=frontend-abc
backendapp=backend-abc
groupname=myAuthResourceGroup
location="West Europe"
os="Linux"
planname=myPlan
backendurl=https://$backendapp.azurewebsites.net
nodeLts="NODE:16-lts"
sku="FREE"

authSettings=$(az webapp auth show -g "$groupname" -n "$frontendapp")
frontendId=$(az webapp auth microsoft show --name $frontendapp --resource-group $groupname --query registration.clientId --output tsv)
backendId=$(az webapp auth microsoft show --name "$backendapp" --resource-group $groupname --query registration.clientId --output tsv)

# Must have user_impersonation scope
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid profile email offline_access api://"$backendId"/user_impersonation"]}')

az webapp auth set --resource-group $groupname --name $frontendapp --body "$authSettings"