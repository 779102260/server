# 询问是否进入预发布模式
pre_release_mode=false
read -p "是否进入预发布模式? [y/n]" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    changeset pre enter beta
    pre_release_mode=true
fi

# 修改版本号
changeset
changeset version

# 询问确认发布
read -p "确认发布? [y/n]" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    changeset publish
fi

# 退出预发布模式
if [[ "$pre_release_mode" == true ]]
then
    changeset pre exit
fi

# 提交
git add .
git commit -m "publish"
git push
