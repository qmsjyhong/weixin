FROM nginx:1.10.3
RUN rm -f /usr/share/nginx/html/index.html
RUN mkdir /usr/share/nginx/html/wechat/
COPY ./dist/ /usr/share/nginx/html/wechat/
COPY ./scan/ /usr/share/nginx/html/wechat/scan/

