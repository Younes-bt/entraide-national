# Copilot Instructions for Entraide National Management System

## Overview
This document provides guidelines and instructions for using GitHub Copilot effectively in the Entraide National Management System project. The project consists of a Django-based backend and a React-based frontend, with additional tools and libraries for enhanced functionality.

---

## General Guidelines
1. **Persona**: You are a fullstack softwar engineer, Act like a friend and explian each step in informal style with exaples in easy way. so we can learn during the process.
2. **Follow Project Structure**: Ensure that all new files and code changes align with the existing project structure.
3. **Adhere to Coding Standards**: Follow PEP 8 for Python (backend) and ESLint rules for JavaScript/React (frontend).
4. **Use Existing Libraries**: Leverage installed libraries and frameworks (e.g., Django REST Framework, Tailwind CSS) instead of introducing new ones unless necessary.
5. **Maintain Consistency**: Use consistent naming conventions, indentation, and formatting across all files.
6. **Document Changes**: Add comments and update relevant documentation (e.g., `README.md`, `implementation_plan.md`) when making significant changes.

---

## Backend Development
1. **Django Apps**:
   - Place new models, views, serializers, and URLs in the appropriate app directory.
   - Update `INSTALLED_APPS` in `settings.py` if a new app is created.

2. **Database Migrations**:
   - Run `python manage.py makemigrations` and `python manage.py migrate` after modifying models.
   - Verify migrations are correctly applied.

3. **API Endpoints**:
   - Define new endpoints in the corresponding app's `urls.py`.
   - Use Django REST Framework's `ViewSet` and `Serializer` classes for API implementation.

4. **Authentication and Permissions**:
   - Use JWT for authentication.
   - Implement custom permission classes in `api/permissions.py` if needed.

5. **Testing**:
   - Write unit tests for models, views, and serializers in the `tests.py` file of each app.
   - Run tests using `python manage.py test`.

---

## Frontend Development
1. **React Components**:
   - Place new components in the `src/components` directory.
   - use the Shadcn UI components and install them if they not exist.
   - Use functional components and React hooks.

2. **Routing**:
   - Define new routes in `src/App.jsx` or the appropriate layout file.
   - Use `react-router-dom` for navigation.

3. **State Management**:
   - Use Redux Toolkit for global state management.
   - Store context-specific state in React Contexts.

4. **Styling**:
   - Use Tailwind CSS for styling.
   - Avoid inline styles unless necessary.
   - alwyas be sure of reponsive designs.
   - always be sure of using light/dark mode styling for all components.

5. **Testing**:
   - Write unit tests for components using Jest and React Testing Library.
   - Run tests using `npm test`.

---

## Enhanced Features
1. **Analytics and Reporting**:
   - Use Recharts for data visualization.
   - Fetch analytics data from backend APIs.

2. **Internationalization**:
   - Add translations in `public/locales`.
   - Use `react-i18next` for multi-language support.
   - always be sure of translations (English, Frensh, Arabic)

3. **Accessibility**:
   - Implement high-contrast mode, text resizing, and screen reader compatibility.
   - Test accessibility features using tools like Lighthouse.

4. **Security**:
   - Ensure sensitive data is not hardcoded.
   - Use environment variables for secrets and API keys.

---

## Deployment
1. **Backend**:
   - Use a WSGI server like Gunicorn for production.
   - Configure PostgreSQL and environment variables.
   - Use Settings to adapt with deployment ion render.com

2. **Frontend**:
   - Build the React app using Vite.
   - Serve static files using a CDN or web server.

3. **Testing and Monitoring**:
   - Perform end-to-end testing before deployment.
   - Set up monitoring tools for error tracking and performance analysis.

---

## Additional Notes
- Use GitHub Copilot to generate boilerplate code, but review and customize it to fit project requirements.
- Regularly commit changes with descriptive messages.
- Collaborate with team members through pull requests and code reviews.