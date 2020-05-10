$ helm3 --kube-context do-tor1-qchsag3 --namespace billohip install billohip-postgresql -f chart/postgresql-values.yaml bitnami/postgresql
NAME: billohip-postgresql
LAST DEPLOYED: Sat Mar 28 09:48:26 2020
NAMESPACE: billohip
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
** Please be patient while the chart is being deployed **

PostgreSQL can be accessed via port 5432 on the following DNS name from within your cluster:

    billohip-postgresql.billohip.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace billohip billohip-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)

To connect to your database run the following command:

    kubectl run billohip-postgresql-client --rm --tty -i --restart='Never' --namespace billohip --image docker.io/bitnami/postgresql:11.7.0-debian-10-r43 --env="PGPASSWORD=$POSTGRES_PASSWORD" --command -- psql --host billohip-postgresql -U postgres -d postgres -p 5432



To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace billohip svc/billohip-postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgres -d postgres -p 5432
