pipeline {
    agent any

    tools {
        nodejs 'NodeJS 14'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/flystar.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("flystar:${env.BUILD_ID}")
                }
            }
        }
        stage('Trivy Scan') {
            steps {
                sh 'trivy image flystar:${env.BUILD_ID}'
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    docker.image("flystar:${env.BUILD_ID}").run("-d", "-p", "8080:8080")
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

