---
layout: blog
title: ROS2 혼자공부하는 로봇SW
tags:
- ROS2
- 로봇
---
ROS(Robot Operating System)2

ROS의 기본적인 사용법에 집중할 것인데 그전에 Linux의 사용법을 간략하게 다룰 겁니다. ROS는 Ubuntu(Linux 기반의 OS)에서 아주 잘 동작하므로 Ubuntu의 사용법에 익숙해질 필요가 있기 때문입니다. 또한 URDF로 로봇을 기술하는 방법, Gazebo에서 시뮬레이션하는 방법과 아두이노를 ROS에서 이용하는 방법도 다음에 출판될 2권에서 다루려고 합니다.  
현재 ROS라는 이름의 유용한 도구는 몇 년 전에 ROS2 버전이 나와서 ROS1에서 ROS2로 넘어가고 있는 과도기입니다. 인터넷 커뮤니티에서는 ROS1이냐, ROS2냐를 가지고 많은논쟁이 있지만, 제 생각에는 무의미한 논쟁인 것 같습니다. 왜냐하면, 다 다룰 줄 알아야 하기 때문입니다.  
여기서는 우분투 20.04를 기준으로 ROS를 이야기 하려고 합니다. 이유는 간단합니다.  
ROS1과 ROS2를 동시에 사용할 수 있는 마지막 우분투 버전이 20.04이기 때문입니다.  
  
이 책이 출판될 때쯤이면 우분투가 버전업 되어 22.04가 나와 있을 것 같습니다. 그러나 그것도 중요하지 않습니다. 아직도 우분투 16.04에서 ROS1 Kinetic 버전으로 개발하는 분들도 많기 때문입니다. 중요한 것은 버전이 아니라 사용법에 대한 이해입니다. 분명 22.04의 우분투에 맞춰 또 새로운 ROS2 버전이 나오겠지만, 그 기본은 바뀌지 않으므로 크게 신경 쓰지 않아도 됩니다.

환경설정  
1. 터미널  
1.1 화면 분할이 되는 터미널의 필요성  
1.2 기본 터미널 사용해보기  
1.3 Terminator  
1.4 Tilix  
2. 편집기  
2.1 Sublime Text의 설치  
2.2 Sublime Text 사용해보기  
3. ROS 설치  
3.1 ROS Galactic 버전 설치 페이지 찾기  
3.2 Set Locale  
3.3 Setup Sources  
3.3 Install ROS2 packages  
3.4 ROS2 설치 확인하기  
4. 마무리  
  
터미널과 bashrc 그리고 리눅스 익숙해지기  
5. 이 장의 목적  
6. Ubuntu의 폴더 관련 기본 명령  
2.1 폴더를 하나 만들어 볼가요 - mkdir  
2.2 폴더를 이동해 몰가요 - cd  
2.3 삭제 명령 = rm  
7. bashrc  
3.1 Shell 쉘  
3.2 .bashrc  
3.3 .bashrc에 명령 입력해 두기  
8. .bashrc에서 alias 설정  
4.1 alias 설정  
4.2 galactic 설정을 alias로 지정하기  
4.3 source ~/.bashrc도 alias로 지정하기  
9. ROS2 도메일 설정  
10. 마무리  
  
ROS2 기본 명령 익히기  
11. 이 장의 목적  
12. Turtlesim 설치와 실행  
13. 다시 강조하는 setup.bash 환경  
14. ROS Node  
15. ROS Service  
5.1 Service의 개념  
5.2 ros2 service list  
5.3 ros2 service type  
5.4 service definition  
5.5 Mobile Robot 소개  
5.6 서비스를 호출하는 방법 service call  
5.7 namespace  
5.8 spawn  
16. ROS Topic  
6.1 Topic의 개념  
6.2 ros2 topic list  
6.3 ros2 topic type  
6.4 ros2 topic info  
6.5 토픽을 사용하기 위해 메시지 타입 확인하기  
6.6 간단하게 터미널에서 토픽 구독해보기  
6.7 주행 명령 토픽 발행해 보기  
6.8 토픽의 흐름을 보여주는 rqt_graph  
17. ROS Action  
7.1 노드 turtle_teleop_key 실행  
7.2 ros2 action list  
7.3 ros2 action send_goal  
18. 마무리  
  
Python으로 ROS2 토픽 다루기  
19. 이 장의 목적  
20. 설치 및 준비  
21. Jupyter의 간단한 사용법 및 Python 기초  
3.1 Jupyter의 기본 사용  
3.2 Markdown 문서  
22. Python으로 토픽 구독하기  
4.1 Jupyter로 토픽을 구독하기 위한 준비  
4.2 코딩에 들어가기 전에 당부의 말  
4.3 구독을 위해 필요한 모듈 import  
4.4 Python Import 방식  
4.5 rclpy의 초기화 및 노드 생성  
4.6 Subscription에서 실행할 callback 함수 작성  
4.7 토픽 subscriber 만들기  
4.8 Jupyter 사용해서 유의할 점  
4.9 토픽을 받는 횟수 제한해보기  
23. Python으로 토픽 발행하기  
5.1 Jupyter로 토픽을 발행하기 위한 준비  
5.2 토픽 발행을 위한 rclpy와 메시지 초기화  
5.3 cmd_vel 토픽의 데이터 타입인 Twist 선언  
5.4 Python으로 cmd_vel 토픽 간단히 발행해보기  
5.5 ROS에서 timer를 이용해서 토픽 발행하기  
24. 노드의 종류  
25. 마무리  
  
Python으로 서비스 크라이언트 다루기  
26. 이 장의 목적  
27. Python으로 ROS Service Client 사용하기  
2.1 학습을 위한 준비와 Service Client를 위한 노드 생성  
2.2 서비스를 요청하는 Service client 생성  
2.3 서비스의 정의(service definition)를 Python에서 사용할 준비하기  
2.4 간단히 service call을 실행해 보기  
2.5 wait_for_service 사용해보기  
2.6 서비스 클라이언트가 실행되는 상황 확인하기  
28. 마무리  
  
ROS2 학습을 위한 Python Class 이해하기  
29. 이 장의 목적  
30. 준비작업 및 그냥 sin 함수 그려보기  
2.1 빈 문서 준비하기  
2.2 matplotlib 사용 준비하고 import 하기  
2.3 domain 준비하기  
2.4 sin 함수 구하기  
2.5 그래프 그려보기  
2.6 함수 def로 구현해보기  
31. 클래스로 sin 함수를 그려보기  
3.1 일단 클래스에 변수라도 등록해보자  
3.2 삼각함수를 그리는 클래스 완성하기  
32. 클래스의 상속 Inherritance  
33. 메서드 오버라이딩 Method Overriding  
34. 클래스에서 super()의 사용  
35. 마무리  
  
패키지 만들고 토픽 다루기  
36. 이 장의 목적  
37. 설치 및 준비  
38. 처음으로 패키지 만들기  
3.1 일단 패키지를 무작정 만들어 보자  
3.2 패키지 빌드 해보기, 그리고 워크스페이스 설정  
39. Topic Subscriber 노드 추가  
4.1 새로운 subscriber 파일 추가하기  
4.2 my_subscriber.py 파일 설명  
4.3 새로 추가한 노드 실행해 보기  
40. Topic Publisher 노드 추가  
5.1 my_publisher.py 파일 설명  
5.2 워크스페이스의 빌드 정보를 지우고 싶다면  
5.3 my_publisher 실행해 보기  
41. 마무리  
  
메시지 정의 만들고 토픽과 서비스에서 다루기  
42. 이 장의 목적  
43. 메시지 정의  
2.1 메시지 정의를 위한 별도의 패키지 만들기  
2.2 메시지 정의 msg definition 만들기  
2.3 새로 정의된 msg를 포함한 패키지 빌드하기  
44. 두 개의 토픽을 구독하고 하나의 토픽을 발행하자  
3.1 turtlesim이 발행하는 pose 토픽 구동 부분부터 시작하자  
3.2 새로 정의한 CmdAndPoseVel을 사용해 보자  
3.3 cmd_vel 토픽도 구독해 보기  
3.4 두 개의 토픽을 구독한 결과를 발행해 보자  
45. 서비스 정의 Service definition 내가 한번 만들어 보자  
4.1 서비스 정의 만들고 빌드하기  
4.2 서비스 서버 만들어 보자  
4.3 서비스 서버 코드 안에 클라이언트 코드를 만들어 보자  
4.4 여러 거북이를 원 모양으로 배치하기 위한 고민  
4.5 여러 거북이를 배치하는 서비스 서버 구현  
4.6 여러 거북이를 등장시키자  
46. 마무리  
  
액션 익숙해지기  
47. 이 장의 목적  
48. 액션 정의 만들기  
2.1 액션 정의를 만들기 위한 준비  
2.2 액션 정의 만들기  
2.3 액션 정의 빌드하기  
49. 간단한 액션 서버로 개념 들여다보기  
3.1 간단히 결과를 보여주는 액션 서버  
3.2 feedback을 액션 서버에 추가해 보기  
50. ROS2 Multi Thread 기초  
51. 지정한 거리만큼 이동하는 액션 서버 만들기  
5.1 전체코드  
5.2 main:멀티스레드 적용  
5.3 TurtleSub_Action: pose 토픽 구독  
5.4 DistTurtleServer: 사용자가 지정한 거리만큼 이동  
52. 액션 서버 간단히 사용해보기  
53. 마무리  
  
Parameter 다루기  
54. 이 장의 목적  
55. 터미널 명령으로 파라미터 사용해보기  
2.1 실습환경  
2.2 ros2 param list  
2.3 ros2 param get  
2.4 ros2 param set  
2.5 ros2 param dump  
2.6 ros2 param load  
56. 코드로 접근하는 파라미터  
3.1 일단 파라미터를 선언하자  
3.2 파라미터를 코드 내에서 사용하는 방법  
3.3 파라미터가 변경되는 것 눈치채기  
57. 마무리  
  
디버그와 관찰을 위한 여러 도구들  
58. 이장의 목적  
59. 로그  
2.1 간단히 rqt_console을 이용해서 로그 확인하기  
2.2 로그 메시지 직접 만들기  
3.rqt  
3.1 rqt_graph  
3.2 rqt_plot  
3.3 topic monitor  
3.4 topic publisher  
60. rosbag  
61. ROSLAUNCH  
5.1 roslaunch 기본  
5.2 parameter 지정하기