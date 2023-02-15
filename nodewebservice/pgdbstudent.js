const express = require('express');
const {Client, Connection} = require('pg');
const format = require('pg-format');

function GetClient()
{
    return new Client( {
        host: "postgres",
        port: 5432,
        user: "docker",
        password: "password",
        database: "mydb"
    });
}

Insert = async (student, res) =>
{		
	let client = GetClient();
	console.log(`Adding new student named ${student.Name}`);
	try
	{
		await client.connect();
		
		let query = format('INSERT INTO "Student"("Name", "Age", "Course") VALUES(%L, %L, %L)  RETURNING *', 
										student.Name,
										student.Age,
										student.Course);
		let results = await client.query(query);
		
		if(results.rowCount > 0)
		{
			console.log('New record added');
			res.status(201).send(results.rows[0]);
		}
		else
		{
			res.status(409).end();
		}			
	}
	catch(error)
	{
		console.log(error);
		res.status(403).send(error);
	}
	finally
	{
		await client.end();
	}	
};

Select = async (res) =>
{
    let client= GetClient();
    console.log(`Reading all the students details`);
    try
    {
        await client.connect();

        let query = 'SELECT * FROM "Student"';
        let result = await client.query(query);

        if(results.rows.length > 0) {
            console.log(`Read ${results.rows.length} records`)
    
        } else {
            console.log(`Database is empty`);
        };
        res.send(results.rows);

    }
    catch(error)
    {
        console.log(error);
        res.status(403).send(error);
    }
    finally
    {
        await client.end();
    }
};

SelectById = async (id, res) =>
{		
	let client = GetClient();
	console.log(`Looking for the student with id ${id}`);
	try
	{
		await client.connect();
		
		let query = format('SELECT * FROM "Student" WHERE "Id"=%L', id);
		let results = await client.query(query);
		
		if(results.rows.length > 0)
		{
			console.log(`Found ${results.rows.length} records`);
			res.send(results.rows[0]);
		}
		else
		{
			console.log(`Record not found for Id=${id}`);
			res.status(409).end();
		}
	}
	catch(error)
	{
		console.log(error);
		res.status(403).send(error);
	}
	finally
	{
		await client.end();
	}
};

SelectByName = async (name, res) =>
{		
	let client = GetClient();
	console.log(`Looking for all the students named ${name}`);
	try
	{
		await client.connect();
		
		let query = format('SELECT * FROM "Student" WHERE "Name"=%L', name);
		let results = await client.query(query);
		
		if(results.rows.length > 0)
			console.log(`Found ${results.rows.length} records`);
		else
			console.log(`Records not found for ${name}`);
		
		res.send(results.rows);
	}
	catch(error)
	{
		console.log(error);
		res.status(403).send(error);
	}
	finally
	{
		await client.end();
	}	
};

Delete = async (id, res) =>
{		
	let client = GetClient();
	console.log(`Delete the student with id = ${id}`);
	try
	{
		await client.connect();
		
		let query = format('DELETE FROM "Student" WHERE "Id"=%L', id);
		let results = await client.query(query);
		
		if(results.rowCount > 0)
		{
			console.log('Record deleted');
			res.send({});
		}
		else
		{
			console.log(`Failed to delete record for Id = ${id}`);
			res.status(409).end();
		}			
	}
	catch(error)
	{
		console.log(error);
		res.status(400).send(error);
	}
	finally
	{
		await client.end();
	}	
};

Put = async (student, res) =>
{		
	let client = GetClient();
	console.log(`Modifying the student with Id = ${student.Id}`);
	try
	{
		await client.connect();
		
		let query = format('UPDATE "Student" SET "Name"=%L, "Age"=%L, "Course"=%L WHERE "Id"=%L',
										student.Name,
										student.Age,
										student.Course,
										student.Id);
		let results = await client.query(query);
		
		if(results.rowCount > 0)
		{
			console.log('Modified the record');
			res.send({});
		}
		else
		{
			console.log(`Failed to modify record for Id = ${student.Id}`);
			res.status(409).end();
		}			
	}
	catch(error)
	{
		console.log(error);
		res.status(403).send(error);
	}
	finally
	{
		await client.end();
	}		
};	

Patch = async (student, res) =>
{		
	let client = GetClient();
	console.log(`Modifying the student with Id = ${student.Id}`);
	try
	{
		//let query: string = 'UPDATE "Student" SET ';
		let queryArgs = [];
		let values = [];
		await client.connect();
		if(student.Name != null) { values.push(student.Name); queryArgs.push('"Name"=%L'); }
		if(student.Age != null) { values.push(student.Age); queryArgs.push('"Age"=%L'); }
		if(student.Course != null) { values.push(student.Course); queryArgs.push('"Course"=%L'); }
		values.push(student.Id);  // Id of record to change

		let query = format.withArray('UPDATE "Student" SET ' + queryArgs.join(",") + ' WHERE "Id"=%L', 
										values);
		let results = await client.query(query);
		
		if(results.rowCount > 0)
		{
			console.log('Modified the record');
			res.send({});
		}
		else
		{
			console.log(`Failed to modify record for Id = ${student.Id}`);
			res.status(409).end();
		}			
	}
	catch(error)
	{
		console.log(error);
		res.status(403).send(error);
	}
	finally
	{
		await client.end();
	}		
};	

module.exports = { Insert, Select, SelectById, SelectByName, Delete, Put, Patch  };




