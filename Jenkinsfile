pipeline {
    agent any
    
    stages {
        stage('Retrieve Credentials') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'ACCOUNT', variable: 'ACCOUNT'),
                        string(credentialsId: 'PASSWORD', variable: 'PASSWORD'),
                        string(credentialsId: 'API_BASE_URL', variable: 'API_BASE_URL'),
                        string(credentialsId: 'API_SPONSOR_URL', variable: 'API_SPONSOR_URL'),
                        string(credentialsId: 'ID_SPONSOR', variable: 'ID_SPONSOR'),
                        string(credentialsId: 'FARM_CONTRACT_ADDRESS', variable: 'FARM_CONTRACT_ADDRESS'),
                        string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    ]) {
                        env.ACCOUNT = ACCOUNT
                        env.PASSWORD = PASSWORD
                        env.API_BASE_URL = API_BASE_URL
                        env.API_SPONSOR_URL = API_SPONSOR_URL
                        env.ID_SPONSOR = ID_SPONSOR
                        env.FARM_CONTRACT_ADDRESS = FARM_CONTRACT_ADDRESS
                        env.JWT_SECRET = JWT_SECRET
                    }
                }
            }
        }
        
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
                   -e ACCOUNT=${ACCOUNT} \
                   -e PASSWORD=${PASSWORD} \
                   -e API_BASE_URL=${API_BASE_URL} \
                   -e API_SPONSOR_URL=${API_SPONSOR_URL} \
                   -e ID_SPONSOR=${ID_SPONSOR} \
                   -e FARM_CONTRACT_ADDRESS=${FARM_CONTRACT_ADDRESS} \
                   -e JWT_SECRET=${JWT_SECRET} \
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
