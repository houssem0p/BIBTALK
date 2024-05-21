# BIBTALK - MERN Web App

BIBTALK is a MERN (MongoDB, Express.js, React.js, Node.js) web application that allows users to discover and discuss books in real-time chat rooms. This README provides information on how to set up the development environment and outlines the features available for users and administrators.

## Table of Contents

Features
Prerequisites
Installation
Usage
User Features
Admin Features

### Features

Real-time chat rooms categorized by book genres.
User authentication and authorization.
Add books to wish lists, mark books as read or currently reading.
Pick and Choose Books according to your custom search inputs or according to thier over-all score.
Discover and discuss books with other users.
Add new books as a user, and wait for the admin approval.
Add reviews to the books, with a score from 1 to 5 and comments.

### Prerequisites

Before you begin, ensure you have met the following requirements:

Node.js installed.
MongoDB installed and running.
Git installed.

### Installation

Clone the repository:
git clone https://github.com/houssem0p/BIBTALK.git

Change into the project directory:
cd BIBTALK

Change into the server directory:
cd back

Install server dependencies:
npm install

Change into the client directory:
cd ../front

Install client dependencies:
npm install

### Usage

Start the server:
cd back
npm run dev

Start the client:
cd front
npm start

Open your browser and visit http://localhost:3000 to access the web application.

### User Features

Real-Time Chat: Engage in real-time conversations with other users in chat rooms based on book genres.
Wish List: Add books to your wish list for future reading.
Reading Progress: Mark books as read or currently being read.
Reviews: Score and add review to any book you want.
Submit a Book request: add a book with its infos and wait for its approval.

### Admin Features

Admin Dashboard: Access to an admin dashboard for managing Pending Books that are waiting for approval.
Book Management: Modify any book with the ability to Remove it completely.

### MADE BY BELAID HOUSSEM EDDINE
