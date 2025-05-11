from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import TrainingPrograme, AnnualCourseDistribution, WeeklyCoursePlan, TrainingCourse
from centers.models import Center # Import Center model

User = get_user_model()

class TrainingProgrameAPITests(APITestCase):
    def setUp(self):
        # Create an admin user for authentication
        self.admin_user = User.objects.create_superuser(
            email='admin_tp@example.com', # Unique email for this setup
            password='adminpassword',
            first_name='Admin',
            last_name='User',
            role=User.Role.ADMIN  # Assuming you have such a role defined
        )
        self.client.force_authenticate(user=self.admin_user)

        # Data for creating a TrainingPrograme
        self.programe_data = {
            'name': 'Test Program Alpha',
            'description': 'A comprehensive test program.',
            'duration_years': 2
        }
        self.programe = TrainingPrograme.objects.create(**self.programe_data)

    def test_list_training_programes(self):
        """Ensure we can list training programes."""
        url = reverse('trainingprograme-list') # Make sure this matches your router basename
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data.get('results', [])), 1)
        self.assertEqual(response.data['results'][0]['name'], self.programe_data['name'])

    def test_create_training_programe(self):
        """Ensure we can create a new training programe."""
        url = reverse('trainingprograme-list')
        data = {
            'name': 'Test Program Beta',
            'description': 'Another test program.',
            'duration_years': 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(TrainingPrograme.objects.filter(name='Test Program Beta').exists())

    def test_retrieve_training_programe(self):
        """Ensure we can retrieve a specific training programe."""
        url = reverse('trainingprograme-detail', kwargs={'pk': self.programe.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.programe_data['name'])

    def test_create_training_programe_unauthenticated(self):
        """Ensure unauthenticated users cannot create a training programe."""
        self.client.force_authenticate(user=None) # Logout
        url = reverse('trainingprograme-list')
        data = {
            'name': 'Unauthorized Program',
            'description': '.',
            'duration_years': 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_training_programe_non_admin(self):
        """Ensure non-admin authenticated users cannot create a training programe."""
        # Create a non-admin user
        student_user = User.objects.create_user(
            email='student_tp@example.com', password='password', role=User.Role.STUDENT # Assuming student role
        )
        self.client.force_authenticate(user=student_user)
        url = reverse('trainingprograme-list')
        data = {
            'name': 'Forbidden Program',
            'description': '.',
            'duration_years': 1
        }
        response = self.client.post(url, data, format='json')
        # Depending on your permission classes, this might be 403 Forbidden
        # If you haven't set up specific object-level or action-level permissions yet,
        # and IsAdminUser is used, this should be 403. If IsAuthenticated is used, it would be 201.
        # Let's assume IsAdminUser or similar for POST for now as per docs.
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AnnualCourseDistributionAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin_acd@example.com', password='password', role=User.Role.ADMIN
        )
        self.client.force_authenticate(user=self.admin_user)
        self.programe = TrainingPrograme.objects.create(
            name='Prerequisite Program', description='For ACD tests', duration_years=1
        )
        self.acd_data = {
            'programe': self.programe.pk,
            'academic_year': '2023-2024'
        }
        self.acd = AnnualCourseDistribution.objects.create(programe=self.programe, academic_year='2023-2024')

    def test_list_annual_course_distributions(self):
        url = reverse('annualcoursedistribution-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data.get('results', [])), 1)
        self.assertEqual(response.data['results'][0]['academic_year'], self.acd_data['academic_year'])

    def test_create_annual_course_distribution(self):
        url = reverse('annualcoursedistribution-list')
        data = {
            'programe': self.programe.pk,
            'academic_year': '2024-2025'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(AnnualCourseDistribution.objects.filter(academic_year='2024-2025').exists())

    def test_retrieve_annual_course_distribution(self):
        url = reverse('annualcoursedistribution-detail', kwargs={'pk': self.acd.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['academic_year'], self.acd_data['academic_year'])
        # Test nested programe data
        self.assertEqual(response.data['programe']['name'], self.programe.name)

    def test_create_acd_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse('annualcoursedistribution-list')
        data = {'programe': self.programe.pk, 'academic_year': '2025-2026'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_acd_non_admin(self):
        student_user = User.objects.create_user(
            email='student_acd@example.com', password='password', role=User.Role.STUDENT
        )
        self.client.force_authenticate(user=student_user)
        url = reverse('annualcoursedistribution-list')
        data = {'programe': self.programe.pk, 'academic_year': '2025-2026'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class WeeklyCoursePlanAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin_wcp@example.com', password='password', role=User.Role.ADMIN
        )
        self.client.force_authenticate(user=self.admin_user)
        programe = TrainingPrograme.objects.create(name='Prog for WCP', description='.', duration_years=1)
        self.annual_dist = AnnualCourseDistribution.objects.create(programe=programe, academic_year='2023-WCP')
        self.wcp_data = {
            'annual_distribution': self.annual_dist.pk,
            'month': 1,
            'week_number': 1,
            'title': 'Intro Week',
            'description': 'Week 1 plan'
        }
        self.wcp = WeeklyCoursePlan.objects.create(annual_distribution=self.annual_dist, month=1, week_number=1, title='Intro Week', description='Week 1 plan')

    def test_list_weekly_course_plans(self):
        url = reverse('weeklycourseplan-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data.get('results', [])), 1)
        self.assertEqual(response.data['results'][0]['title'], self.wcp_data['title'])

    def test_create_weekly_course_plan(self):
        url = reverse('weeklycourseplan-list')
        data = {
            'annual_distribution': self.annual_dist.pk,
            'month': 1,
            'week_number': 2,
            'title': 'Advanced Week',
            'description': 'Week 2 plan'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(WeeklyCoursePlan.objects.filter(title='Advanced Week').exists())

    def test_retrieve_weekly_course_plan(self):
        url = reverse('weeklycourseplan-detail', kwargs={'pk': self.wcp.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.wcp_data['title'])
        # Test nested annual_distribution data
        self.assertEqual(response.data['annual_distribution']['academic_year'], self.annual_dist.academic_year)

    def test_create_wcp_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse('weeklycourseplan-list')
        data = {'annual_distribution': self.annual_dist.pk, 'month': 2, 'week_number': 3, 'title': 'Unauth', 'description': '.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_wcp_non_admin(self):
        student_user = User.objects.create_user(
            email='student_wcp@example.com', password='password', role=User.Role.STUDENT
        )
        self.client.force_authenticate(user=student_user)
        url = reverse('weeklycourseplan-list')
        data = {'annual_distribution': self.annual_dist.pk, 'month': 2, 'week_number': 3, 'title': 'Forbidden', 'description': '.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TrainingCourseAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin_tc@example.com', password='password', role=User.Role.ADMIN
        )
        self.trainer_user = User.objects.create_user(
            email='trainer_tc@example.com', password='password', role=User.Role.TEACHER # Assuming TEACHER role
        )
        self.client.force_authenticate(user=self.admin_user)

        self.programe = TrainingPrograme.objects.create(name='Prog for TC', description='.', duration_years=1)
        # Assuming a Center model and basic fields for it. Adjust if your Center model is different.
        self.center = Center.objects.create(name='Test Center TC', city='Test City') 

        self.tc_data = {
            'program': self.programe.pk,
            'center': self.center.pk,
            'trainer': self.trainer_user.pk
        }
        self.tc = TrainingCourse.objects.create(program=self.programe, center=self.center, trainer=self.trainer_user)

    def test_list_training_courses(self):
        url = reverse('trainingcourse-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data.get('results', [])), 1)
        self.assertEqual(response.data['results'][0]['program']['id'], self.programe.pk)

    def test_create_training_course(self):
        url = reverse('trainingcourse-list')
        another_trainer = User.objects.create_user(email='trainer2@example.com', password='pass', role=User.Role.TEACHER)
        data = {
            'program': self.programe.pk,
            'center': self.center.pk,
            'trainer': another_trainer.pk
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(TrainingCourse.objects.filter(trainer=another_trainer).exists())

    def test_retrieve_training_course(self):
        url = reverse('trainingcourse-detail', kwargs={'pk': self.tc.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['program']['id'], self.programe.pk)
        self.assertEqual(response.data['center']['id'], self.center.pk)
        self.assertEqual(response.data['trainer']['id'], self.trainer_user.pk)

    def test_create_tc_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse('trainingcourse-list')
        data = {'program': self.programe.pk, 'center': self.center.pk, 'trainer': self.trainer_user.pk}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_tc_non_admin(self):
        student_user = User.objects.create_user(
            email='student_tc@example.com', password='password', role=User.Role.STUDENT
        )
        self.client.force_authenticate(user=student_user)
        url = reverse('trainingcourse-list')
        data = {'program': self.programe.pk, 'center': self.center.pk, 'trainer': self.trainer_user.pk}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
