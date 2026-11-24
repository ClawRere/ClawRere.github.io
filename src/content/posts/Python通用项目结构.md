---
title: Python通用项目结构
author: leidada
date: '2024-05-22 15:41'
updated: '2024-05-22 15:41'
abbrlink: 9a8dbf86
comments: false
description:
cover:
categories:
keywords:
tags:
---

![Pasted image 20240522155443.png](https://raw.githubusercontent.com/Eddie-Hyu/picx-images-hosting/master/poster/Pasted%20image%2020240522155443.png)
```cmd
project_name/
    README.md
    requirements.txt
    setup.py
    project_name/
        __init__.py
        main.py
        module1/
            __init__.py
            module1.py
        module2/
            __init__.py
            module2.py
        tests/
            __init__.py
            test_module1.py
            test_module2.py
```
其中：

- `README.md`：项目的介绍文档，包含项目的简介、使用方法、安装方法等信息。
- `requirements.txt`：项目依赖的第三方库列表。
- `setup.py`：用于构建、打包、发布项目的脚本。
- `project_name`：项目主目录，也可以使用其他名称代替。
- `__init__.py`：一个空文件，用于标识目录是 Python 包。
- `main.py`：项目的入口文件，可以包含项目的启动代码。
- `module1/、module2/`：项目的模块目录，包含项目的不同功能模块，可以根据需要添加或删除。
- `tests/`：项目的测试目录，包含单元测试和集成测试等。
这种目录结构可以使项目组织清晰，方便维护和扩展。在实际开发中，也可以根据项目的具体需求进行适当的调整。

requirements.txt 文件，用于列出项目所依赖的 Python 包及其版本。文件中每行写入一个依赖项，格式为 `包名==版本号`。例如：

```
requests==2.25.1
numpy==1.20.1
pandas==1.2.3
```
如果没有指定版本号，则会安装最新版本。可以使用 pip freeze 命令生成一个 requirements.txt 文件，命令如下：
```
pip freeze > requirements.txt
```
此命令会将当前环境中安装的所有 Python 包及其版本信息输出到 requirements.txt 文件中。

可以使用 pip 命令来安装 requirements.txt 中列出的所有依赖项。在终端中切换到包含 requirements.txt 的目录下，然后运行以下命令：
```
pip install -i https://mirrors.cloud.tencent.com/pypi/simple  --no-cache-dir -r requirements.txt
```

`setup.py` 是一个 Python 脚本，用于打包和分发 Python 项目。下面是一个最基本的 setup.py 范例：
```
from setuptools import setup, find_packages

setup(
    name='my_project',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        'requests',
        'numpy',
        'pandas',
    ],
)
```
`setup()` 函数的参数如下：

- `name`: 包的名称
- `version`: 包的版本号
- `packages`: 需要包含在包中的模块或子包，使用 find_packages() 函数自动查找
- `install_requires`: 项目所依赖的 Python 包及其版本号

在项目根目录下运行以下命令可以打包项目：
```
python setup.py sdist bdist_wheel
```
这个命令会生成一个 dist 目录，其中包含两个文件：

以`.tar.gz` 格式打包的源代码分发包
以 `.whl` 格式打包的二进制分发包（如果使用了 C 扩展模块，需要编译为不同平台的二进制包）
可以使用 `pip install` 命令来安装分发包：
```
pip install dist/my_project-0.1.tar.gz
# 或者
pip install dist/my_project-0.1.whl
```
这样就可以将项目打包并分发给其他用户了。

通常python的入口方法这样写
```python
import argparse
import logging

logging.basicConfig(level=logging.INFO)

def main():
    parser = argparse.ArgumentParser(description="Calculate the square of a number")
    parser.add_argument("number", type=float, help="The number to be squared")
    args = parser.parse_args()

    logging.info(f"Calculating square of {args.number}")
    result = args.number ** 2

    print(f"The square of {args.number} is {result}.")

if __name__ == "__main__":
    main()
```


示例：一个典型的flask项目目录结构
一个典型的Flask项目的目录结构如下：
```
myflaskproject/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── home.html
│   │   └── ...
│   └── static/
│       ├── css/
│       ├── js/
│       └── ...
├── config.py
├── requirements.txt
├── run.py
└── README.md
```
- `app/`：应用程序目录，包含应用程序的核心代码。
- `app/__init__.py`：应用程序的初始化文件，创建Flask应用对象并配置应用程序。
- `app/models.py`：应用程序的模型文件，包含数据库模型定义。
- `app/views.py`：应用程序的视图文件，包含路由和视图函数的定义。
- `app/templates/`：模板目录，包含应用程序的HTML模板文件。
- `app/static/`：静态文件目录，包含应用程序的静态资源文件，如CSS、JavaScript等。
- `config.py`：配置文件，包含应用程序的配置信息。
- `requirements.txt`：项目的依赖文件，列出了项目所需的所有依赖包及其版本号。
- `run.py`：应用程序的入口文件，用于启动应用程序。
- `README.md`：项目的说明文档，通常使用Markdown格式编写。

- `app/ `目录是主要的应用程序目录，包含了所有的Flask应用程序代码。
	- `__init__.py` 文件是应用程序的入口点，创建Flask应用程序实例。

```python
from flask import Flask
from flask_restful import Api
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

api = Api(app)

from app import routes
```
- `models.py` 文件用于定义数据库模型。
```python
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)
```

* `user.py`
```python
from flask_restful import Resource
from app.models import User

class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return {'id': user.id, 'username': user.username, 'email': user.email}
        else:
            return {'message': 'User not found'}, 404
```

- `resources/ `目录用于存放RESTful API的资源文件，每个资源对应一个文件。
- `routes.py `文件用于定义路由和视图函数。
```python
from app import api
from app.resources.user import UserResource

api.add_resource(UserResource, '/users/<int:user_id>')
```
- utils.py 文件用于存放一些辅助函数或工具函数。
- `test_user.py`

```python
import unittest
from app import app

class UserTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_user(self):
        response = self.app.get('/users/1')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['username'], 'john')
        self.assertEqual(data['email'], 'john@example.com')
```
 
- `tests/ `目录用于存放测试代码。
- `config.py` 文件用于存放配置信息。
```python
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```
 
- `requirements.txt` 文件用于存放项目依赖的Python包。
```
Flask
Flask-RESTful
```
 
- `run.py` 文件用于启动应用程序。
```python
from app import app

if __name__ == '__main__':
    app.run()
```

这样的目录结构可以使你的项目更加清晰和易于维护。实际开发可以根据真实需求对目录结构进行调整和扩展。