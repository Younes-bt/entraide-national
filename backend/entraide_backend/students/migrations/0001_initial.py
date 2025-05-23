# Generated by Django 5.2 on 2025-05-05 22:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('centers', '0001_initial'),
        ('programs', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exam_id', models.CharField(max_length=20, unique=True)),
                ('center_code', models.CharField(blank=True, max_length=20, null=True)),
                ('academic_year', models.CharField(max_length=10)),
                ('joining_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('center', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to='centers.center')),
                ('group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='students', to='centers.group')),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to='programs.trainingprograme')),
                ('training_course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='students', to='programs.trainingcourse')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='student_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
