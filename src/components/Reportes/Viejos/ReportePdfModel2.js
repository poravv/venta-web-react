/*

#Consulta general
create or replace view vw_reporte_general as 
with inicio as (
select ROW_NUMBER() OVER (
		ORDER BY idmateria
	) rownum ,idmateria from vw_evaluaciones m1 
    where idconvocatoria=parametro()
    group by idmateria
),
c_evaluacion as (
select * from vw_evaluaciones
where idconvocatoria=parametro()
),
resultado as (
select 
(select 0) as idinscripcion, 
(select 0 ) as idpersona, 
(select 0 ) as idconvocatoria, 
(select '0' ) as anho,
(select 'Tipo' ) as tipo,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=1 limit 1) as columna1,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=2 limit 1) as columna2,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=3 limit 1) as columna3,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=4 limit 1) as columna4,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=5 limit 1) as columna5,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=6 limit 1) as columna6,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=7 limit 1) as columna7,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=8 limit 1) as columna8,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=9 limit 1) as columna9,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=10 limit 1) as columna10,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=11 limit 1) as columna11,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=12 limit 1) as columna12,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=13 limit 1) as columna13,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=14 limit 1) as columna14,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=15 limit 1) as columna15,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=16 limit 1) as columna16,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=17 limit 1) as columna17,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=18 limit 1) as columna18,
(select m.descripcion from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=19 limit 1) as columna19
from (select idmateria,descripcion from c_evaluacion group by idmateria,descripcion limit 1) a
union all 
select 
a.idinscripcion,
a.idpersona,
a.idconvocatoria,
a.anho,
a.tipo,
case when (select 1 from inicio where rownum=1) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=1 and a.idinscripcion=m.idinscripcion) else null end as calificacion1,
case when (select 1 from inicio where rownum=2) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=2 and a.idinscripcion=m.idinscripcion) else null end as calificacion2,
case when (select 1 from inicio where rownum=3) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=3 and a.idinscripcion=m.idinscripcion) else null end as calificacion3,
case when (select 1 from inicio where rownum=4) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=4 and a.idinscripcion=m.idinscripcion) else null end as calificacion4,
case when (select 1 from inicio where rownum=5) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=5 and a.idinscripcion=m.idinscripcion) else null end as calificacion5,
case when (select 1 from inicio where rownum=6) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=6 and a.idinscripcion=m.idinscripcion) else null end as calificacion6,
case when (select 1 from inicio where rownum=7) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=7 and a.idinscripcion=m.idinscripcion) else null end as calificacion7,
case when (select 1 from inicio where rownum=8) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=8 and a.idinscripcion=m.idinscripcion) else null end as calificacion8,
case when (select 1 from inicio where rownum=9) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=9 and a.idinscripcion=m.idinscripcion) else null end as calificacion9,
case when (select 1 from inicio where rownum=10) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=10 and a.idinscripcion=m.idinscripcion) else null end as calificacion10,
case when (select 1 from inicio where rownum=11) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=11 and a.idinscripcion=m.idinscripcion) else null end as calificacion11,
case when (select 1 from inicio where rownum=12) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=12 and a.idinscripcion=m.idinscripcion) else null end as calificacion12,
case when (select 1 from inicio where rownum=13) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=13 and a.idinscripcion=m.idinscripcion) else null end as calificacion13,
case when (select 1 from inicio where rownum=14) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=14 and a.idinscripcion=m.idinscripcion) else null end as calificacion14,
case when (select 1 from inicio where rownum=15) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=15 and a.idinscripcion=m.idinscripcion) else null end as calificacion15,
case when (select 1 from inicio where rownum=16) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=16 and a.idinscripcion=m.idinscripcion) else null end as calificacion16,
case when (select 1 from inicio where rownum=17) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=17 and a.idinscripcion=m.idinscripcion) else null end as calificacion17,
case when (select 1 from inicio where rownum=18) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=18 and a.idinscripcion=m.idinscripcion) else null end as calificacion18,
case when (select 1 from inicio where rownum=19) then (select IFNULL(m.calificacion,0) from c_evaluacion m join inicio i on i.idmateria=m.idmateria and i.rownum=19 and a.idinscripcion=m.idinscripcion) else null end as calificacion19
from (select idinscripcion,idpersona,idconvocatoria,anho,tipo from c_evaluacion group by idinscripcion,idpersona,idconvocatoria,anho,tipo) a
)
select 
	case 
		when ga.grado is not null and ga.armas is not null then 
			concat(ga.grado,' ',ga.armas)
		when ga.grado is not null and ga.armas is null then 
			ga.grado
		when ga.armas is not null and ga.grado is null then 
			ga.armas
		else 'Grado/Arma' 
	end as grado,
	case when ins.numero is not null then ins.numero else 'Numero' end as numero,
	case when p.nombre is not null then concat(p.nombre,' ',p.apellido) else 'Nombres' end as nombres,
    #case when p.documento is not null then concat('="',p.documento,'"') else 'Documentos' end as documento,
	case when p.documento is not null then p.documento else 'Documentos' end as documento,
	v.*,
    case when v.idconvocatoria ='Convocatoria' then 'Promedio' else 
	FLOOR(
    (
	#to_number(case when columna1 is null then 0 else columna1 end)+
	#to_number(case when columna2 is null then 0 else columna2 end)+
	#to_number(case when columna3 is null then 0 else columna3 end)+
	#to_number(case when columna4 is null then 0 else columna4 end)+
	#to_number(case when columna5 is null then 0 else columna5 end)+
	#to_number(case when columna6 is null then 0 else columna6 end)+
	#to_number(case when columna7 is null then 0 else columna7 end)+
	#to_number(case when columna8 is null then 0 else columna8 end)+
	#to_number(case when columna9 is null then 0 else columna9 end)+
	#to_number(case when columna10 is null then 0 else columna10 end)+
	#to_number(case when columna11 is null then 0 else columna11 end)+
	#to_number(case when columna12 is null then 0 else columna12 end)+
	#to_number(case when columna12 is null then 0 else columna13 end)+
	#to_number(case when columna14 is null then 0 else columna14 end)+
	#to_number(case when columna15 is null then 0 else columna15 end)+
	#to_number(case when columna16 is null then 0 else columna16 end)+
	#to_number(case when columna17 is null then 0 else columna17 end)+
	#to_number(case when columna18 is null then 0 else columna18 end)+
	#to_number(case when columna19 is null then 0 else columna19 end)
	case when columna1 is null then 0 else columna1 end+
	case when columna2 is null then 0 else columna2 end+
	case when columna3 is null then 0 else columna3 end+
	case when columna4 is null then 0 else columna4 end+
	case when columna5 is null then 0 else columna5 end+
	case when columna6 is null then 0 else columna6 end+
	case when columna7 is null then 0 else columna7 end+
	case when columna8 is null then 0 else columna8 end+
	case when columna9 is null then 0 else columna9 end+
	case when columna10 is null then 0 else columna10 end+
	case when columna11 is null then 0 else columna11 end+
	case when columna12 is null then 0 else columna12 end+
	case when columna12 is null then 0 else columna13 end+
	case when columna14 is null then 0 else columna14 end+
	case when columna15 is null then 0 else columna15 end+
	case when columna16 is null then 0 else columna16 end+
	case when columna17 is null then 0 else columna17 end+
	case when columna18 is null then 0 else columna18 end+
	case when columna19 is null then 0 else columna19 end
	)/(select max(rownum) from inicio limit 1)) end as promedio
from resultado v
left join persona p 
	on p.idpersona=v.idpersona
left join grados_arma ga 
	on ga.idgrados_arma=p.idgrados_arma
left join inscripcion ins 
	on ins.idpersona=p.idpersona
	and v.idconvocatoria=ins.idconvocatoria;


*/