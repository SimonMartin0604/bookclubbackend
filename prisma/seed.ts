import dotenv from 'dotenv';
import { PrismaClient , members} from '../generated/prisma/client';
import { faker } from '@faker-js/faker';
dotenv.config();

const prisma = new PrismaClient();

async function main(){
    await prisma.$transaction(async (tx) => {
        const allMembers : members[] = await tx.members.findMany();

        for(let i = 0; i < 15; i ++){
            const randomMember = faker.helpers.arrayElement(allMembers)

            await tx.payments.create({
                data:{
                    member_id: randomMember.id,
                    amount: faker.number.int({min: 100, max: 100000}),
                    paid_at: faker.date.past()
                }
            })
        }
    })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });