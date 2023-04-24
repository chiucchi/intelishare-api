import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1682288563673 implements MigrationInterface {
    name = 'Default1682288563673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investigations" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investigations" ADD "involveds" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investigations" ADD "files" bytea array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "investigations" DROP COLUMN "files"`);
        await queryRunner.query(`ALTER TABLE "investigations" DROP COLUMN "involveds"`);
        await queryRunner.query(`ALTER TABLE "investigations" DROP COLUMN "date"`);
    }

}
