# ml-phone-price

Tarayıcıda çalışan bir makine öğrenmesi modeli. Bu model ile amacımız, akıllı telefonların özelliklerinden bu cihazların fiyatlarını tahmin etmek. Bu proje, aldığım bir makine öğrenmesi dersinin dönem ödevidir.

- Modelin eğitimi için kullanılan veri: [Mobile Price Classification](https://www.kaggle.com/iabhishekofficial/mobile-price-classification)
- Matris kütüphanesi: [mljs/matrix](https://github.com/mljs/matrix)
- Javascript için KNN (K Nearest Neighbors) kütüphanesi: [mljs/knn](https://github.com/mljs/knn)
- Web uygulamasına dönüştürmek için: [React.js](https://reactjs.org)
- Ön yüzde kullanılan komponentler: [Material-UI](https://material-ui.com)

Uygulamaya buradan erişilebilir: https://thesseyren.github.io/ml-phone-price/

## Kurulum ve Geliştirme

- Her şeyden önce bağımlılıkların indirilmesi gerek: `npm install`
- Modeli eğitmek için: `npm run trainmodel`
- CSV dosyasından test örnekleri çıkarmak için: `npm run createexamples`
- Artık uygulama yerel ortamda çalışmaya hazır: `npm start`
- Build almak için: `npm run build`
- Doğrudan Github Pages'a göndermek için: `npm run deploy`