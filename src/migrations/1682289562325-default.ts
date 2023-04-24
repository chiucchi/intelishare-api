import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1682289562325 implements MigrationInterface {
    name = 'Default1682289562325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investigations" ADD "uf" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investigations" DROP COLUMN "uf"`);
    }

}
