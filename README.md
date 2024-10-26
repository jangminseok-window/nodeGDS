# Nodejs 사용하여 항공 GDS API 구축 사이트
****
# Apache와 Node.js 연동 

이 가이드는 Apache 웹 서버와 Node.js 애플리케이션을 연동하는 방법을 설명합니다.

## 1. Apache 모듈 활성화

 필요한 Apache 모듈을 활성화합니다.
sudo a2enmod proxy
sudo a2enmod proxy_http

Apache 설정 파일 수정:
/etc/apache2/sites-available 디렉토리의 해당 사이트 설정 파일(예: 000-default.conf)을 수정합니다.
sudo nano /etc/apache2/sites-available/000-default.conf

프록시 설정 추가:
VirtualHost 블록 내에 다음 설정을 추가합니다.
text
<VirtualHost *:80>
    # 기존 설정들...

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass /gds http://localhost:xxxx
    ProxyPassReverse /gds http://localhost:xxxx

    # 기타 설정들...
</VirtualHost>

****
# Redis 설치 및 연동 

이 가이드는 Apache 웹 서버와 Node.js 애플리케이션을 연동하는 방법을 설명합니다.

## 1. Apache 모듈 활성화
 1.  설치 sudo apt install redis-server
 2.  Redis 서비스 시작:
  sudo systemctl start redis-server
  sudo systemctl restart redis-server
 3. redis 설치 확인:
   redis-cli ping --> PONG 
 4.설정 수정 – 외부 접속 허용
    sudo nano /etc/redis/redis.conf
    bind 0.0.0.0
 5. 윈도우용 접속 tool - redis-insight
   https://redis.io/redis-enterprise/redis-insight/
   requirepass -----
 6. 프로그램 연동
         User.js 파일 참고




