# WebMember
회원가입 / 로그인 기능 구현

**Nodejs를 이용한 회원가입/로그인 서버 입니다.**<br>
**데이터베이스는 mongoDB를 사용하였습니다.**<br>

# 서버 사용방법                                                                                                                                                             
## 회원가입
신규유저 등록
### 요청
> [POST] /users/signup

전달값
<pre>
{
  'userid' : 'hongildong',
  'password' : 'hong1234',
  'nickname' : '홍길동'
}
</pre>

### 결과
#### 성공
<pre>
{
  '_id' : '1234567890',
  'userid' : 'hongildong',
  'password' : 'hong1234',
  'nickname' : '홍길동'
}
</pre>
#### 실패
<pre>
{
  'message' : '400 Bad Request'
}
</pre>

## 로그인
아이디, 패스워드 둘다 맞아야 로그인  
### 요청
> [POST] /users/signin

전달값
<pre>
{
  'userid' : 'hongildong',
  'password' : 'hong1234'
}
</pre>
### 결과
#### 성공
<pre>
{
  '_id' : '1234567890',
  'userid' : 'hongildong',
  'password' : 'hong1234',
  'nickname' : '홍길동'
}
</pre>
#### 실패
<pre>
{
  'message' : '400 Bad Request'
}
</pre>
