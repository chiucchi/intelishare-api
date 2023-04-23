import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1682199631065 implements MigrationInterface {
    name = 'Default1682199631065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "telephone" text NOT NULL, "birthDate" TIMESTAMP NOT NULL, "uf" text NOT NULL, "notifications" text array NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "investigations" ("id" SERIAL NOT NULL, "name" text NOT NULL, "author" text NOT NULL, "tags" text array NOT NULL, "permitedUsers" integer array NOT NULL, "isPublic" boolean NOT NULL DEFAULT true, "user_id" integer, CONSTRAINT "PK_2fffe8ebb1cf4b2fc03a26ac8d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investigations" ADD CONSTRAINT "FK_25f0c73f6ab26d62351aa59b464" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investigations" DROP CONSTRAINT "FK_25f0c73f6ab26d62351aa59b464"`);
        await queryRunner.query(`DROP TABLE "investigations"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
