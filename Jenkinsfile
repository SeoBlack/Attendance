pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/SeoBlack/Attendance.git'
            }
        }
        stage('Build') {
            steps {
                dir('attendance-backend') {
                    sh 'mvn clean install' // sh for linux and ios
                }
            }
        }
        stage('Test') {
            steps {
            dir('attendance-backend') {
                sh 'mvn test'
                }
            }
        }
        stage('Code Coverage') {
            steps {
                dir('attendance-backend') {
                    sh 'mvn jacoco:report'
                }
            }
        }
        stage('Publish Test Results') {
            steps {
                dir('attendance-backend') {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        stage('Publish Coverage Report') {
            steps {
                dir('attendance-backend') {
                    recordCoverage(tools: [[parser: 'JACOCO']])
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                dir('attendance-backend') {
                    withSonarQubeEnv('SonarQubeServer') {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }
    }
}