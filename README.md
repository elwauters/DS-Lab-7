# 6-Distributed Systems front-end project

This is the GUI project for part 5 of the 6-DS group project.

## Getting Started

First, clone this repository in the g2c1 remote node:
```bash
git clone https://github.com/elwauters/DS-Lab-7.git
```

Next, install the dependencies on the remote node (make sure npm is installed):
```bash
npm install
```
This will create a node_modules folder in the project root.



Then start the development server:
```bash
npm run dev
```

This will start a development server on port 3000 on the remote node g2c1.

To access the Vue.js application via your own local machine, it is required to create a SSH tunnel to this port
on the remote node.
```bash
ssh -L 3000:localhost:3000 -p 2021 root@6dist.idlab.uantwerpen.be
```

Now the development server becomes available at http://localhost:3000 on your local machine.

