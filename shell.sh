if grep -q 'CustomField' package.xml;then
  Fname=$(grep 'members' package.xml | sed -e 's/[/]//' | sed -e 's/<members>#*//'| sed -e 's/<members>%*//')
  for val in $Fname; do
  Psearch=$(grep $val force-app/main/default/profiles/Admin.profile-meta.xml | sed -e 's/[/]//' | sed -e 's/<field>#*//'| sed -e 's/<field>%*//')
    echo $val
    echo $Psearch
    val=`echo $val | sed 's/ *$//g'`
    Psearch=`echo $Psearch | sed 's/ *$//g'`
    echo ["$val = $Psearch"]
    if [[ $Psearch = $val ]]
    then
       echo "found"
    else
      echo "not found"
    fi
  done
fi
