1. htaccess в корне 
RewriteEngine on
RewriteRule ^(.*)?$ /web/$1
2. config/web.php
'cookleValidationKey' => 'fsdgasdg(любой спам)'
2.1 раскоментить urlManager
2.2 раскоментить ниже 
'allowedIPs' => ['берем из wsr.ru YOUR IP']
2.3 еще ниже 
'allowedIPs' => ['*']
2.4 в любом месте (например перед массивом components) добавляем
'language' => 'ru'
2.5 в массиме components -> request добавляем
'baseUrl' => '',

3. config/db.php, меняем данные под себя, а именно
'dsn' => 'чето;dbname=..._m1'
'username' => '...'
'password' => '...'
данные из wsr.ru
4. findIndentity return static::findOne($id);
public function beforeSave($insert)
    {
        $this->password = md5($this->password);
        return parent::beforeSave($insert);
    }
6. 
[
              'attribute' => 'gender',
                'value' => fn($model) => $model->gender == 'male' ? 'Мужской' : 'Женский'
 ],
[
              'attribute' => 'marital_status',
                'value' => fn($model) => match ($model->marital_status){
                    'married' => 'Женат',
                    'holostyeajajk' => 'Холостяк',
                    default => $model->marital_status,
                }
],

5. UserController и
 ['label' => 'Регистрация', 'url' => ['/user/create'], 'visible' => Yii::$app->user->isGuest],
['username', 'match', 'pattern' => '/^[A-z]\w*$/i'],
[['password'], 'string', 'max' => 255, 'min' => 6]
7. actionView
 $model = $this->findModel($id);
        if ($model->status !== 'ready') {
            Yii::$app->session->setFlash('error', 'Доступ к просмотру возможен только для заявок со статусом "Готов"');
            return $this->redirect(['index']);
        }
actionUpdate
 if ($model->status === 'ready' && $model->save()){
                return $this->redirect(['view', 'id' => $model->id]);
            }
8.
<?php if ($model->isNewRecord): ?>
<?php else: ?>
 <?php endif; ?>
'mask' => 'x(999)xx-99',
        'definitions' => [
                'x' => [
                        'validator' => '[А-Яа-я]',
                        'cardinality' => 1,
                ]
        ]

'validator' => '[A-Za-zА-Яа-я]', // разрешаем английские и русские буквы
'validator' => '[A-Za-z]'
$cars = Car::find()
    ->select(['number'])
    ->indexBy('id')
    ->column()
?>
-
['attribute' => 'id_car',
                'value' => function ($model) {
                    return $model->car->number ;
                }],
-
['attribute' => 'status',
            'value' => function ($model) {
            return $model->status ? 'Да' : 'Нет';
            }],
-
public function checkPaid()
    {
        $unpaidViolations = Violation::find()
            ->where(['id_car' => $this->id, 'status' => 0])
            ->exists();
        if (!$unpaidViolations){
            Violation::deleteAll(['id_car' => $this->id]);
            $this->delete();
            return true;
        }
        return false;
    }
-
CREATE TABLE violation (
  id INT NOT NULL AUTO_INCREMENT,
  id_car INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type ENUM('Speed', 'dtp', 'rement') NOT NULL,
  price INT NOT NULL,
  status BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);
-
requestController  actionCreate
return $this->redirect(['routes/index', 'route_id' => $model->route_id]);
routesController actionIndex
public function actionIndex($route_id = null){
$query = Routes::find();

        if ($route_id !== null){
            $query->andWhere(['route_id'=>$route_id]);
        }

 $dataProvider = new ActiveDataProvider([
            'query' => $query,
<?php if (Yii::$app->request->get('route_id')): ?>
        <div class="alert alert-info">
            Показаны маршруты только для выбранного направления: <?= Route::findOne(Yii::$app->request->get('route_id'))->name ?>
        </div>
    <?php endif; ?>
-
 ['user_id', 'default', 'value' => Yii::$app->user->identity->getId()],
-
 <?= $form->field($model, 'status')->dropDownList([
            'accepted' => 'Принят',
            'work' => 'В работе',
            'ready' => 'Готов',
        ]) ?>
-
if ($model->load($this->request->post())) {
                $bookExist = Book::find()
                    ->where(['name'=>$model->name, 'author' => $model->author])
                    ->exists();
                if ($bookExist){
                    Yii::$app->session->setFlash('success','Книга уже есть в нашей библиотеке');
                    return $this->redirect(['book/index', 'name' => $model->name, 'author' => $model->author]);
                }
                if ($model->save()) {
                    Yii::$app->session->setFlash('success', 'Ваша заявка принята. Мы уведомим вас, когда книга появится.');
                    return $this->redirect(['book/index']);
                }
            }
