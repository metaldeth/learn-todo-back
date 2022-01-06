import {MigrationInterface, QueryRunner} from "typeorm";

export class initial21641100419979 implements MigrationInterface {
    name = 'initial21641100419979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TaskDescription" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, CONSTRAINT "PK_7c55aece28248363d05405ac6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userTaskListConnect" ("id" integer NOT NULL, "isOwner" boolean NOT NULL, "userId" integer NOT NULL, "taskListId" integer NOT NULL, CONSTRAINT "PK_73fa36e0af3128c8bf6f5843a4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taskList" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "connectTaskId" integer, "connectTaskListId" integer, "userConnectId" integer, CONSTRAINT "PK_27d740f0baf101d7f90ce404eca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TaskListConnect" ("taskId" integer NOT NULL, "taskListId" integer NOT NULL, CONSTRAINT "PK_6c75abbf2f7b7acd5ed8c5a4fab" PRIMARY KEY ("taskId", "taskListId"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "taskDescriptionId" integer NOT NULL, "connectTaskId" integer, "connectTaskListId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coment" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "taskId" integer NOT NULL, "useId" integer NOT NULL, "userId" integer, CONSTRAINT "PK_5091d71989f6edd5e5d3e928a71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD CONSTRAINT "FK_619dd342b142d9f3cb7127b44ca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD CONSTRAINT "FK_7543bdf0b8793f1f23e13785823" FOREIGN KEY ("taskListId") REFERENCES "taskList"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_0f5222a6533b98256610dcdb682" FOREIGN KEY ("connectTaskId", "connectTaskListId") REFERENCES "TaskListConnect"("taskId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_5a38eb317f69992d12801ca3d9a" FOREIGN KEY ("userConnectId") REFERENCES "userTaskListConnect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ADD CONSTRAINT "FK_38861d8d57018b3b7cce53c5ab6" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ADD CONSTRAINT "FK_b9d6353218b08f6c08d1485ee8e" FOREIGN KEY ("taskListId") REFERENCES "taskList"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_e54d482833b899b32400e28ceac" FOREIGN KEY ("connectTaskId", "connectTaskListId") REFERENCES "TaskListConnect"("taskId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coment" ADD CONSTRAINT "FK_48d68a3e5855e9ebad9495c00a8" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coment" ADD CONSTRAINT "FK_a50104329392a79249001fe751b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coment" DROP CONSTRAINT "FK_a50104329392a79249001fe751b"`);
        await queryRunner.query(`ALTER TABLE "coment" DROP CONSTRAINT "FK_48d68a3e5855e9ebad9495c00a8"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_e54d482833b899b32400e28ceac"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" DROP CONSTRAINT "FK_b9d6353218b08f6c08d1485ee8e"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" DROP CONSTRAINT "FK_38861d8d57018b3b7cce53c5ab6"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_5a38eb317f69992d12801ca3d9a"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_0f5222a6533b98256610dcdb682"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP CONSTRAINT "FK_7543bdf0b8793f1f23e13785823"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP CONSTRAINT "FK_619dd342b142d9f3cb7127b44ca"`);
        await queryRunner.query(`DROP TABLE "coment"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "TaskListConnect"`);
        await queryRunner.query(`DROP TABLE "taskList"`);
        await queryRunner.query(`DROP TABLE "userTaskListConnect"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "TaskDescription"`);
    }

}
