#!/bin/bash

version=20130412
prefix=/public/sourcecode
installPath=/public/sourcecode/gridviewAppTemplate
applications="basic BIO CAE MD QM"
commonFiles="checkpbs CommonCheck.sh CommonComp.js CommonConf.setting CommonFunction.js CommonHelp.js createpbs Readme portal.type setConfigure.sh"

function changeVersion()
{
for application in $applications
do
	apps=`ls $application`
	for app in $apps
	do
		echo application : $app
		sed -i "s/version\=.*/version=$version/g" $application/$app/$app.setting
#                cat $application/$app/$app.setting
#		sleep 1
	done
done

echo "version have changed!"
echo

}

changeVersion

function makeInstall()
{
if [ -d $installPath ]
then
	cd $prefix
	tar -zcf gridviewAppTemplate-20`date +%y%m%d`.tgz gridviewAppTemplate/
	rm -rf $installPath
fi

cd /opt/gridview/gridviewAppTemplate
mkdir -p $installPath

for application in $applications
do
	mkdir -p $installPath/$application
	apps=`ls $application`
        for app in $apps
	do
		cp -r $application/$app $installPath/$application/$app-$version
	done
done

mkdir $installPath/Common-$version
for cf in $commonFiles
do
	cp $cf $installPath/Common-$version
done

cp install.sh $installPath
cp reinstall.sh $installPath
cp portal.lic $installPath
cp portal.type $installPath
cp Readme $installPath

echo " new version is made!!! "

}


makeInstall
