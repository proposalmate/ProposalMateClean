# ProposalMate

ProposalMate is a complete SaaS application that allows users to create, manage, and send professional proposals with ease. The application includes user authentication, proposal generation with PDF/DOC export, Stripe payment integration, and a comprehensive user dashboard.

## Features

- **User Authentication System**
  - Secure signup/login functionality
  - Email verification
  - Password reset capabilities
  - JWT-based authentication

- **Proposal Generation Tool**
  - Create professional proposals through an intuitive interface
  - Export proposals as PDF or DOC files
  - Save and manage proposal drafts
  - Track proposal status (draft, sent, viewed, accepted, rejected)

- **Stripe Payment Integration**
  - 7-day free trial
  - £7/month subscription billing
  - Secure payment processing
  - Subscription management (cancel, resume, update payment)

- **User Dashboard**
  - Overview of created proposals with statistics
  - Interface to view, edit, and download past proposals
  - Subscription management section
  - User profile settings

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Stripe
- **Document Generation**: PDFKit, docx
- **Deployment**: Docker

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- Stripe account with API keys
- Email service for sending verification emails

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/proposalmate.git
cd proposalmate
// trigger redeploy