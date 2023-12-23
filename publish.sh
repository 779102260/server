# 询问是否进入预发布模式
read -p "是否进入预发布模式? [y/n]" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    changeset pre enter
fi

# 修改版本号
changeset version

# 询问确认发布
read -p "确认发布? [y/n]" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    changeset publish
fi

# 提交
git add .
read -p "commit message: " message # 输入commit message
git commit -m "$message"
git push