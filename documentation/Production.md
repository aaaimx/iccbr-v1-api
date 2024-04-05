## Access to remote AWS server (EC2)

The server for the Back-End processes is hosted on AWS, to access it it is recommended to use the SSH protocol, follow the steps to achieve this:

1. Request the **Key pair assigned at launch** from the project administrator, with this you will have access to the EC2 server.

> [!TIP]
> If you prefer to create your own key you can follow these steps:
>
> 1. A Key pair assigned at launch is required, for this you must request the credentials of the main AWS account, once accessed go to EC2 > Instances and the instances created so far will appear, where the server is hosted is the one with the name of **iccbr-2024**, access this instance.
>
> 2. All the details of the server such as public IP, private IP, etc. will be displayed. Scrolling a little, an option like this **Key pair assigned at launch** will appear with the name **iccbr-key**, access this key.
>
> 3. Click on the **Create Key pair** button and follow the steps, once downloaded save in a folder, preferably where you have the two local repositories (Front-End and Back-End).

2. Once we have the key pair in our folder, we will access from the terminal to the location where said key pair is.

3. Write the following command to access remotely:

```
ssh ubuntu@public-IPv4 -i iccbr-key.pem
```

> [!IMPORTANT]
> Instead of putting **public-IPv4** remember to put the public IPv4 that EC2 provides us.

Ready, we have already accessed the AWS EC2 server for this project, now you can view the Back-End repository by following these steps:

1. Access the repository:

```
cd main
ls
```

2. The **ls** command will show the different repositories of the existing projects (if any), to access this project's repository run the following command:

```
cd iccbr-v1-api
```

The server must be running, to check this you can run the following command:

```
ps aux | grep npm
```

> [!TIP]
> The **ps aux** command displays all the running processes on the system along with detailed information about them. The **grep npm** command filters the output of ps aux, displaying only the lines that contain the word "npm". In short, this command shows the npm related processes that are running on the system.

It should display something like this:

```
ubuntu     11044  7.4  6.6 1100996 64536 pts/0   Sl   04:49   0:00 npm start
```

In case no process is shown, then you can initialize the remote server with the following command:

```
npm start &
```

> [!TIP]
> This command runs the startup script defined in the **package.json** file of a **Node.js** project using npm. The npm start part indicates to run the startup script defined in the "scripts" section of the package.json file, usually used to start the application. The **&** at the end of the command runs the script in the background, allowing the terminal to be available for other operations while the application is running.

If you run the command again to see the processes it should appear running.
