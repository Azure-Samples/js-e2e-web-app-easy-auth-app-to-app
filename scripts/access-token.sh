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
frontendId=$(az webapp auth microsoft show --name "$frontendapp" --resource-group "$groupname" --query registration.clientId --output tsv)
backendId=$(az webapp auth microsoft show --name "$backendapp" --resource-group "$groupname" --query registration.clientId --output tsv)

firstParam="scope=openid email profile offline_access api://$backendId/user_impersonation"
paramArrayObj=$( jq --null-input \
        --arg p1 "$firstParam" \
        '{"loginParameters": [$p1]}' )
echo paramArrayObj= $paramArrayObj
authSettings=$(echo "$authSettings" | jq '.properties' | jq --argjson p "$paramArrayObj" '.identityProviders.azureActiveDirectory.login += $p')
az webapp auth set --resource-group "$resourcegroupname" --name "$frontendapp" --body "$authSettings"
