# Prerequisites: jq (available in the Azure Cloud Shell)

resourcegroup="diberry-app-to-app"
frontend="diberry-frontend-2"
backend="diberry-backend-2"
loginParameters="scope=openid profile email offline_access api://$backend/user_impersonation"

# Get the current auth settings
authSettings=$(az webapp auth show -g $resourcegroup -n $frontend)

# Add the login parameters to the Azure AD identity provider
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":[$loginParameters]}')

# Update the auth settings
az webapp auth set --resource-group myAuthResourceGroup --name $frontend --body "$authSettings"