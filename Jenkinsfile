pipeline {
    agent any
    
    stages {
        
        stage('Packaging') {
            steps {
                sh 'docker build --pull --rm -f Dockerfile -t blcapstion_vechain_interaction_server:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh 'docker tag blcapstion_vechain_interaction_server:latest tuanhuu3264/blcapstion_vechain_interaction_server:latest'
                    sh 'docker push tuanhuu3264/blcapstion_vechain_interaction_server:latest'
                }
            }
        }

        stage('Deploy Vechain Interaction Server to DEV') {
            steps {
                echo 'Deploying and cleaning'
                sh '''
                if [ $(docker ps -q -f name=blcapstion_vechain_interaction_server) ]; then 
                    docker container stop blcapstion_vechain_interaction_server
                fi
                echo y | docker system prune
                docker container run -d --name blcapstion_vechain_interaction_server -p 3000:3000 \
                   tuanhuu3264/blcapstion_vechain_interaction_server
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
