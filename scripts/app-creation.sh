frontendapp=frontend-abc
backendapp=backend-abc
groupname=myAuthResourceGroup
location="West Europe"
os="Linux"
planname=myPlan
backendurl=https://$backendapp.azurewebsites.net
nodeLts="NODE:16-lts"
sku="Free"

#cd js-e2e-web-app-easy-auth-app-to-app/
cd ../frontend/
az webapp up --resource-group "$groupname" --name "$frontendapp" --plan "$planname" --sku "$sku" --location "$location" --os-type "$os" --runtime "$nodeLts"
cd ../backend/
az webapp up --resource-group "$groupname" --name "$backendapp" --runtime "$nodeLts"
az webapp config appsettings set --name "$frontendapp" --resource-group "$groupname" --settings BACKEND_URL="$backendurl"
