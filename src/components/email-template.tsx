import * as React from 'react';

interface EmailTemplateProps {
    name: string;
    email: string;
    password: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name,
    email,
    password
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      Your account has been created with the following credentials:
    </p>
    <p>
      <strong>Email:</strong> {email}
    </p>
    <p>
      <strong>Password:</strong> {password}
    </p>
    <p>
        please dont share this information with anyone
    </p>
    <a href='https://exhibitors.igeco.mx'>
        Click here to login to your account
    </a>
  </div>
);
