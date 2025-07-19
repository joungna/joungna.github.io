
### 옵시디언 깃허브 연결 연동

1.폴더와 vault 만들기
깃허브 저장소와 연결할 로컬 폴더(옵시디언 vault)를 설정

터미널 또는 명령 프롬프트에서 git init 명령어를 실행하여 로컬 Git 저장소를 .git 만들며 초기화
.gitignore 설정,.gitignore 파일을 생성하여 불필요한 파일 (예: .obsidian/workspace.json, .obsidian/app.json, .trash 등)이 Git에 의해 추적되지 않도록 설정
git add . 명령어를 사용하여 변경 사항을 스테이징 영역에 추가
git commit -m "Initial commit" 명령어를 사용하여 커밋

2.깃허브 저장소(Repository) 만들기,깃 저장소 복제하기
GitHub에 로그인하고, 새 저장소를 생성
<GitHub 저장소 주소> https://github.com/joungna/blockchainsto.git
로컬 저장소에서 원격 저장소를 추가: git remote add origin <GitHub 저장소 주소>
git push -u origin main 명령어를 실행하여 로컬 저장소의 내용을 원격 저장소로 푸시
로컬 터미널에서 GitHub 저장소의 메인 브랜치(main 또는 master)를 확인하려면 git branch 

3.옵시디언 열기, 보관함 폴더 열기 선택 > github 레파지토리와 연결된 폴더 위치 선택 

4.플러그인인 'Obsidian Git'을 사용 git 설치
  커뮤니티 플러그인에 Git 생성된것을 확인
Custom Git binary path 에 복사한 Git repository의 링크를 붙여 
https://github.com/joungna/blockchainsto.git

5.깃허브 저장소 주소, 사용자 이름, 이메일 등 필요한 정보를 입력
다음으로 push와 pull을 할 수 있게 Automatic 부분을 활성화하고 주기도 설정->수동으로 해도됨(`https://github.com/joungna/blockchainsto.git` 같은 **GitHub URL**은 이 설정란에 **그대로 넣으면 안 됩니다**)

Custom base path	C:\Users\joungna\Obsidian\blockchainsto ← 로컬 Vault 경로
Custom Git directory path	.git 또는 비워두기
Git 리포지터리 원격(remote) 주소, Obsidian Git 플러그인의 로컬 설정에는 사용하지 않습니다.

6.아래 명령어를 아까 옵시디언의 로컬 저장소에 열었던 git 터미널에 입력한다.
git push -u origin main
Stage -> Commit -> Push 버튼을 차례대로 눌렀다. 