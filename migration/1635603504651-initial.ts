import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1635603504651 implements MigrationInterface {
    name = 'initial1635603504651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TaskDescription" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, CONSTRAINT "PK_7c55aece28248363d05405ac6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taskList" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "connectId" integer, CONSTRAINT "PK_27d740f0baf101d7f90ce404eca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TaskListConnect" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "taskId" integer NOT NULL, "taskListId" integer NOT NULL, CONSTRAINT "PK_da359d6bb33ca4d5450843b7880" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "taskDescriptionId" integer NOT NULL, "connectId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coment" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_5091d71989f6edd5e5d3e928a71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_6e86dbb96d86048c78f602a0f1b" FOREIGN KEY ("connectId") REFERENCES "TaskListConnect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ADD CONSTRAINT "FK_38861d8d57018b3b7cce53c5ab6" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ADD CONSTRAINT "FK_b9d6353218b08f6c08d1485ee8e" FOREIGN KEY ("taskListId") REFERENCES "taskList"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_b6346dbe49c7727cadc32fe308e" FOREIGN KEY ("connectId") REFERENCES "TaskListConnect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coment" ADD CONSTRAINT "FK_48d68a3e5855e9ebad9495c00a8" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coment" DROP CONSTRAINT "FK_48d68a3e5855e9ebad9495c00a8"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b6346dbe49c7727cadc32fe308e"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" DROP CONSTRAINT "FK_b9d6353218b08f6c08d1485ee8e"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" DROP CONSTRAINT "FK_38861d8d57018b3b7cce53c5ab6"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_6e86dbb96d86048c78f602a0f1b"`);
        await queryRunner.query(`DROP TABLE "coment"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "TaskListConnect"`);
        await queryRunner.query(`DROP TABLE "taskList"`);
        await queryRunner.query(`DROP TABLE "TaskDescription"`);
    }

}
