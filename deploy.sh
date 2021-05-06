echo "Building new deployment..."
npm run build-prod
echo "Removing old deployment..."
rm -rf /mnt/nfs/joshua-neely.com/core_public/dragon-fractals
echo "Copying new deployment..."
cp -r dist/dragon-fractals /mnt/nfs/joshua-neely.com/core_public/dragon-fractals
echo "Done"
