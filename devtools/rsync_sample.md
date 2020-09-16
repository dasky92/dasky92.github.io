# rsync samples

> rsync [option] source [source option] destination

```bash
-a:
-v:
-z:
--append:
--backup,-b:
--checksum,-c:
--delete:
-e:
--exclude:
--exclude-from:
--existing,--ignore-non-existing:
--ignore-existing:
-h:
--link-dest:
-m:
-r:
--remove-source-files:

```

## Sample

1. example1

> rsync -av ~/home/user --exclude="git*" username@remote_host:/home/user2

2. example2
> rsync -avz username@remote_host:/home/user2 --exclude-from=exclude.txt ~/home/user

3. example3
> rsync -avz -e "ssh -p 22" ~/home/user --exclude="git*" rsync://remote_host/module/destination 

4. example4
> rsync -av --delete --link-dest /compare/path /home/user rsync://remote_host/module/destination


