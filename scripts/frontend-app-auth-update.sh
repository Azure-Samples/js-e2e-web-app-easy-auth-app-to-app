frontend="diberry-frontend-2"
backend="diberry-backend-2"

authSettings=$(az webapp auth show -g myAuthResourceGroup -n $frontend)
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid profile email offline_access api://$backend/user_impersonation"]}')

echo $authSettings

az webapp auth set --resource-group myAuthResourceGroup --name $frontend --body "$authSettings"