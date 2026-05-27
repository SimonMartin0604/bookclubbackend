import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma.service';
import { AppModule } from 'src/app.module';

@Injectable()
export class MembersService {
  constructor(private readonly db: PrismaService){}
  create(createMemberDto: CreateMemberDto) {
    return this.db.members.create({
      data:{
        name: createMemberDto.name,
        gender: createMemberDto.gender,
        birth_date: new Date(createMemberDto.birth_date)
      },select: {
        name:true,
        gender:true,
        birth_date:true,
      }
    });
  }

  async pay(memberId: number ){
    const member = await this.db.members.findUnique({
      where: {id: memberId}
    })

    if(!member){
      throw new NotFoundException("A tag nem található!")
    }

    const most = new Date();
    const ev = most.getFullYear();
    const honap = most.getMonth();

    const honapeleje = new Date(ev, honap, 1, 0,0,0,0)
    const honapvege = new Date(ev, honap+1, 0, 23, 59, 59, 59)

    const marfizetett = await this.db.payments.findFirst({
      where:{
        member_id: memberId,
        paid_at: {
          lte: honapvege,
          gte: honapeleje
        }
      }
    });
    if(marfizetett){
      throw new ConflictException("A tag már fizetett a hónapban.")
    }

    const ujFizetes = await this.db.payments.create({
      data:{
        member_id: memberId,
        amount: 5000,
        paid_at: most
      }
    })

    return{
      id: ujFizetes.id,
      member_id: ujFizetes.member_id,
      amount: ujFizetes.amount,
      paid_at: ujFizetes.paid_at
    }
  }

  findAll() {
    return this.db.members.findMany({
      select:{
        id:true,
        name: true,
        gender: true,
        birth_date: true,
        created_at: true,
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
